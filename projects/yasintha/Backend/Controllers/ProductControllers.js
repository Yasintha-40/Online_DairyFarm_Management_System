//data display
const product = require("../Model/ProductModel");

const getAllproducts = async (req,res,next) => {

    let products;
    // Get all Products
    try{
       products = await product.find();
    }catch(err){
       console.log(err);
    }
    //not found
    if(!products){
        return res.status(404).json({massage:"Product not found"})
    }
    //Display all products
    return res.status(200).json({products});
};

//data Insert

const addproducts = async(req,res,next) =>{

   const {ProductId,ProductName,ProductCategory,ProductDescription,ProductPrice,ProductQuantity,ManufactureDate,ExpireDate,ImageURL} = req.body;
   
   let products;
   try{
      products = new product({ProductId,ProductName,ProductCategory,ProductDescription,ProductPrice,ProductQuantity,ManufactureDate,ExpireDate,ImageURL});
      await products.save();
   }catch(err){
        console.log(err);
   }
   //not insert the productsdetails
   if(!products){
   return res.status(404).send({message:"unable to add products"});
   }
   return res.status(200).json({products});
};

//Get by ID
const getById = async (req, res,next)=>{

  const id = req.params.id;
  
  let products;

  try{
    products = await product.findById(id);

  }catch(err){
    console.log(err);
  }
   //not insert the productsdetails
   if(!products){
    return res.status(404).json({message:"product not found"});
    }
    return res.status(200).json({products});
}
//update product details
const updateproducts = async (req,res,next)=>{

  const id = req.params.id;
  const {ProductId,ProductName,ProductCategory,ProductDescription,ProductPrice,ProductQuantity,ManufactureDate,ExpireDate,ImageURL} = req.body;

  let products;
  try{
    products = await product.findByIdAndUpdate (id,
        {ProductId,ProductName,ProductCategory,ProductDescription,ProductPrice,ProductQuantity,ManufactureDate,ExpireDate,ImageURL});
    products = await products.save();
 }catch(err){
      console.log(err);
 }  
 if(!products){
  return res.status(404).json({message:"unable to the update product details"});
  }
  return res.status(200).json({products});
};

//Delete Product Details
const deleteproducts = async (req,res,next)=>{
const id = req.params.id;

let products;

try{
    products = await product.findByIdAndDelete(id)

}catch(err){
    console.log(err);
}
if(!products){
    return res.status(404).json({message:"unable to the delete product details"});
    }
    return res.status(200).json({products});
};
exports.getAllproducts = getAllproducts;
exports.addproducts = addproducts;
exports.getById = getById;
exports.updateproducts = updateproducts;
exports.deleteproducts = deleteproducts;