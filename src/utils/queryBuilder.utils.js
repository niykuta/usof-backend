class QueryBuilder {
  constructor(baseQuery) {
    this.query = baseQuery;
    this.params = [];
    this.whereConditions = [];
  }

  where(condition, ...params) {
    this.whereConditions.push(condition);
    this.params.push(...params);
    return this;
  }

  whereIn(column, values) {
    if (values.length === 0) return this;
    const placeholders = values.map(() => '?').join(',');
    this.whereConditions.push(`${column} IN (${placeholders})`);
    this.params.push(...values);
    return this;
  }

  whereBetween(column, start, end) {
    if (start) {
      this.whereConditions.push(`${column} >= ?`);
      this.params.push(start);
    }
    if (end) {
      this.whereConditions.push(`${column} <= ?`);
      this.params.push(end);
    }
    return this;
  }

  orderBy(column, direction = 'ASC') {
    const validDirections = ['ASC', 'DESC'];
    const dir = validDirections.includes(direction.toUpperCase()) ? direction.toUpperCase() : 'ASC';
    this.query = this.query.replace('{{ORDER_BY}}', `ORDER BY ${column} ${dir}`);
    return this;
  }

  limit(count, offset = 0) {
    if (count) {
      this.query = this.query.replace('{{LIMIT}}', `LIMIT ${parseInt(count)} OFFSET ${parseInt(offset)}`);
    } else {
      this.query = this.query.replace('{{LIMIT}}', '');
    }
    return this;
  }

  build() {
    let finalQuery = this.query;

    if (this.whereConditions.length > 0) {
      const whereClause = this.whereConditions.join(' AND ');
      finalQuery = finalQuery.replace('{{WHERE}}', `AND ${whereClause}`);
    } else {
      finalQuery = finalQuery.replace('{{WHERE}}', '');
    }

    if (!finalQuery.includes('{{ORDER_BY}}')) {
      finalQuery = finalQuery.replace('{{ORDER_BY}}', '');
    }

    if (!finalQuery.includes('{{LIMIT}}')) {
      finalQuery = finalQuery.replace('{{LIMIT}}', '');
    }

    return {
      query: finalQuery,
      params: this.params
    };
  }
}

export class PostQueryBuilder {
  static buildPostQuery(baseQuery, options = {}) {
    const {
      sortBy = 'likes',
      sortOrder = 'DESC',
      categories = [],
      status = null,
      dateFrom = null,
      dateTo = null,
      limit = null,
      offset = 0
    } = options;

    const builder = new QueryBuilder(baseQuery);

    if (categories.length > 0) {
      builder.where(`p.id IN (
        SELECT DISTINCT pc.post_id
        FROM post_categories pc
        WHERE pc.category_id IN (${categories.map(() => '?').join(',')})
      )`, ...categories);
    }

    if (status) {
      builder.where('p.status = ?', status);
    }

    builder.whereBetween('p.created_at', dateFrom, dateTo);

    const sortColumn = sortBy === 'date' ? 'p.created_at' : 'total_likes';
    builder.orderBy(sortColumn, sortOrder);

    if (limit) {
      builder.limit(limit, offset);
    }

    return builder.build();
  }
}

export default QueryBuilder;