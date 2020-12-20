function hasSqlOrCss(value) {
  if (value === null || value === undefined) {
    return false;
  }
  
  var sql_meta = new RegExp('(%27)|(--)|(%23)|(#)', 'i');
  if (sql_meta.test(value)) {
    return true;
  }
  var sql_meta2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(--)|(%3B)|(;))', 'i');
  if (sql_meta2.test(value)) {
    return true;
  }
  var sql_typical = new RegExp('w*((%27))((%6F)|o|(%4F))((%72)|r|(%52))', 'i');
  if (sql_typical.test(value)) {
    return true;
  }
  var sql_union = new RegExp('((%27))union', 'i');
  if (sql_union.test(value)) {
    return true;
  }
  var simple_css_attack = new RegExp('((%3C)|<)((%2F)|/)*[a-z0-9%]+((%3E)|>)', 'i');
  if (simple_css_attack.test(value)) {
    return true;
  }
  var img_src_css_attack = new RegExp('((%3C)|<)((%69)|i|(%49))((%6D)|m|(%4D))((%67)|g|(%47))[^\n]+((%3E)|>)', 'i');
  if (img_src_css_attack.test(value)) {
    return true;
  }
  var paranoid_regex_css_attack = new RegExp('((%3C)|<)[^\n]+((%3E)|>)', 'i');
  if (paranoid_regex_css_attack.test(value)) {
    return true;
  }
  return false;
}
function middleware(req, res, next) {
  var containsSqlOrCss = false;
  if (req.originalUrl !== null && req.originalUrl !== undefined) {
    if (hasSqlOrCss(req.originalUrl) === true) {
      containsSqlOrCss = true;
    }
  }
  if (containsSqlOrCss === false) {
    if (req.body) {
      let body = JSON.parse(JSON.stringify(req.body));
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
      if (hasSqlOrCss(body) === true) {
        containsSqlOrCss = true;
      }
    }
    if (containsSqlOrCss === true) {
      res.status(403).json({
        'message': 'Forbidden'
      });
    } else {
      next();
    }
  } else {
    res.status(403).json({
      'message': 'Forbidden'
    });
  }
}
module.exports = middleware;