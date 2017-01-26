var common = {
    utils: {}
};

(function($) {

common.utils.newGuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
    function(c) 
    {
        var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

common.utils.compareObjects = function (o, p) {
    var i,
        keysO = Object.keys(o).sort(),
        keysP = Object.keys(p).sort();
    if (keysO.length !== keysP.length)
        return false;//not the same nr of keys
    if (keysO.join('') !== keysP.join(''))
        return false;//different keys
    for (i=0;i<keysO.length;++i)
    {
        if (o[keysO[i]] instanceof Array)
        {
            if (!(p[keysO[i]] instanceof Array))
                return false;
            //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
            //would work, too, and perhaps is a better fit, still, this is easy, too
            if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join(''))
                return false;
        }
        else if (o[keysO[i]] instanceof Date)
        {
            if (!(p[keysO[i]] instanceof Date))
                return false;
            if ((''+o[keysO[i]]) !== (''+p[keysO[i]]))
                return false;
        }
        else if (o[keysO[i]] instanceof Function)
        {
            if (!(p[keysO[i]] instanceof Function))
                return false;
            //ignore functions, or check them regardless?
        }
        else if (o[keysO[i]] instanceof Object)
        {
            if (!(p[keysO[i]] instanceof Object))
                return false;
            if (o[keysO[i]] === o)
            {//self reference?
                if (p[keysO[i]] !== p)
                    return false;
            }
            else if (common.utils.compareObjects(o[keysO[i]], p[keysO[i]]) === false)
                return false;//WARNING: does not deal with circular refs other than ^^
        }
        if (o[keysO[i]] !== p[keysO[i]])//change !== to != for loose comparison
            return false;//not the same value
    }
    return true;
  }

common.utils.isObject = function(val) {
      return val !== null && typeof val === "object";
  };

common.utils.deepCompare = function(val1, val2) {
      if (common.utils.isObject(val1) && common.utils.isObject(val2)) {
          return common.utils.compareObjects(val1, val2);
      } else {
          return val1 === val2;
      }
  };

}(jQuery));