const Product = require('../models/product');

const getAllProductsStatic = async (req,res) => {
    const product = await Product.find({price: {$gt:30}}).select('name company price').sort('price');
    res.status(200).json({product, nbHits:product.length});
}

const getAllProducts = async (req,res)=> {
    const {featured,company,name,sort,fields, numericFilter} = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === 'true'? true : false;
    }
    if(company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = {$regex: name, $options: 'i'};
    }
    if (numericFilter) {
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq',
        }
        const regEx = /\b(<|>|>=|=|<=)\b/g;
        let filters = numericFilter.replace(regEx,(match) => '-$'+operatorMap[match]+'-');
    const options = ['price','rating'];
    filters.split(',').foreach((item) => {
        const [field,operator,value] = item.split('-');
        if (options.includes(field)) {
            queryObject[field]={[operator]: Number(value)}
        }
    })
}

    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(" ");
        result = result.sort(sortList); 
    }
    else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }
    const page = Number(req.query.page) || 1 ; 
    const limit = Number(req.query.limit) || 10 ;
    const skip = (page - 1) * limit ;
    result = result.skip(skip).limit(limit);
    const product = await result;
    res.status(200).json({product, nbHits: product.length});
}

module.exports = {
    getAllProducts, getAllProductsStatic
};