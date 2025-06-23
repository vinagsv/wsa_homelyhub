import validator from "validator";
const { toDate } = validator;

class APIFeatures {
  // constructor
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // Methods
  filter() {
    let filterQuery = {};
    let queryObj = { ...this.queryString };

    // Min and Max values
    if (queryObj.minPrice && queryObj.maxPrice) {
      if (queryObj.maxPrice.includes(">")) {
        filterQuery.price = { $gte: queryObj.minPrice };
      } else {
        filterQuery.price = {
          $gte: queryObj,
          minPrice,
          $lte: queryObj.maxPrice,
        };
      }
      ``;
    }
    // propert types
    if (queryObj.roomType) {
      filterQuery.roomType = queryObj.roomType;
    }

    // amenities
    if (queryObj.amenities) {
      filterQuery["amenities.name"] = { $all: queryObj.amenities };
    }

    this.query = this.query.find(filterQuery);
    return this;
  }

  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    // search using city
    searchQuery = queryObj.city
      ? {
          // search using city
          $or: [
            {
              "address.city": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
            {
              "address.state": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
            {
              "address.area": queryObj.city?.toLowerCase().replaceAll(" ", ""),
            },
          ],
        }
      : {};

    if (queryObj.guests) {
      searchQuery.maximumGuest = { $gte: queryObj.guests };
      queryObj.guests;
    }

    if (queryObj.dateIn && queryObj.dateOut) {
      searchQuery.$and = [
        {
          currentBookings: {
            $not: {
              $eleMatch: {
                $or: [
                  {
                    fromDate: { $lt: queryObj.dateOut },
                    toDate: { $gt: queryObj.dateIn },
                  },
                  {
                    fromDate: { $lt: queryObj.dateIn },
                    toDate: { $gt: queryObj.dateOut },
                  },
                ],
              },
            },
          },
        },
      ];
    }
    this.query = this.query.find(searchQuery);
    return this;
  }

  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 12;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { APIFeatures };
