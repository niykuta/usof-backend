class QueryBuilder {
  constructor(baseQuery) {
    this.query = baseQuery;
    this.params = [];
    this.whereConditions = [];
    this.havingConditions = [];
  }

  where(condition, ...params) {
    this.whereConditions.push(condition);
    this.params.push(...params);
    return this;
  }

  having(condition, ...params) {
    this.havingConditions.push(condition);
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

    if (this.havingConditions.length > 0) {
      const havingClause = this.havingConditions.join(' AND ');
      finalQuery = finalQuery.replace('{{HAVING}}', `HAVING ${havingClause}`);
    } else {
      finalQuery = finalQuery.replace('{{HAVING}}', '');
    }

    finalQuery = finalQuery.replace(/\{\{ORDER_BY}}/g, '');
    finalQuery = finalQuery.replace(/\{\{LIMIT}}/g, '');

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
      userId = null,
      limit = null,
      offset = 0,
      search = null,
      commentCount = null
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

    if (userId) {
      builder.where('p.user_id = ?', userId);
    }

    if (search) {
      builder.where('(p.title LIKE ? OR p.content LIKE ?)', `%${search}%`, `%${search}%`);
    }

    builder.whereBetween('p.created_at', dateFrom, dateTo);

    if (commentCount !== null) {
      builder.having('comment_count = ?', commentCount);
    }

    let sortColumn;
    switch (sortBy) {
      case 'created_at':
      case 'date':
        sortColumn = 'p.created_at';
        break;
      case 'views':
        sortColumn = 'p.views';
        break;
      case 'comments':
        sortColumn = 'comment_count';
        break;
      case 'likes':
      default:
        sortColumn = 'total_likes';
        break;
    }
    builder.orderBy(sortColumn, sortOrder);

    builder.limit(limit, offset);

    return builder.build();
  }
}

export default QueryBuilder;