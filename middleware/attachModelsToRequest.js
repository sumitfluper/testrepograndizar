const glob=require('glob');
const path=require('path');
const modelObj={};

//Attach all the available models to the request obj.
glob(path.join(__dirname,'..','models','*.js'),{cwd:path.resolve(path.join(__dirname))},(err,models)=>{
    if(err){
        console.log('Error Occured including models');
        return;
    }
   models.forEach(modelLoc=>{
       //Split the path string based on '/'
       let modelSplitValue=modelLoc.split('/');
       //Set the last element as model name removing js extention
       let modelName=modelSplitValue[modelSplitValue.length-1].split('.')[0];
       //Set the object with the model object
       modelObj[modelName]=require(modelLoc);
   })
})

function attachModels(req,res,next){
    //Attach models to the request
    req['models']=modelObj;

    next();
}

module.exports = attachModels