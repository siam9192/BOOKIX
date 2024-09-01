import mongoose, { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    private query: any,
  ) {}

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm && searchableFields.length) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  find() {
    const queryObj = { ...this.query };
    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'fields', 'page'];
    for (let field of excludeFields) {
      delete queryObj[field];
    }
    
    this.modelQuery = this.modelQuery.find({ ...queryObj });
    return this;
  }
  sort() {
    let sort = '-createdAt';
    if (this.query.sort) {
      sort = (this.query.sort as string).split(',').join(' ');
    }
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  populate (path:string){
    if(path){
      this.modelQuery = this.modelQuery.populate(path)
    }
   return this
  }
  get(){
    return this.modelQuery
  }
   
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this
  }
  count() {
    this.modelQuery.countDocuments();
    return this.modelQuery;
  }
  textSearch() {
    if (this.query.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $text: { $search: this.query.searchTerm },
      });
    }
    return this;
  }
}

export default QueryBuilder;
