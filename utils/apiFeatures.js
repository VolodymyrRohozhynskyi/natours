const { omit } = require('lodash');

class APIFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter() {
    const queryObj = omit(this.queryParams, [
      'page',
      'sort',
      'limit',
      'fields',
    ]);
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const buildSort = (sortParams) => {
        const sort = {};
        const fields = sortParams.split(';');
        fields.forEach((field) => {
          const [key, order] = field.split(',');
          sort[key] = order === 'desc' ? -1 : 1;
        });
        return sort;
      };
      this.query = this.query.sort(buildSort(this.queryParams.sort));
    } else {
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.queryParams.page || 1;
    const limit = +this.queryParams.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
