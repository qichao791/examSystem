exports.importQuessToProfessionalBank = async(req,res) =>{ 
    try{
      let data = req.body;
      //console.log("professionalBankData:",data)
        for(let i=0,j=0;i<data.length;i++){
          let ques = new ProfQues();  
  
          let departId = await Depart.findOne({ depart_name:data[i].depart_name},'_id');
          let branchId_list = await Branch.find({ branch_name:data[i].branch_name},'_id');
          ques.depart_id = departId._id;
          for(j=0;j<branchId_list.length;j++){ 
            const br = await Branch.aggregate(
              [
              {
                $lookup: {
                  from: "department", //the colletion named department in the database qc of mongodb
                  localField: "_id", //the field of the collection branch which also is the model Branch in mongoose
                  foreignField: "branches", //the field of the collection department
                  as: "belongedToDepart",
                },
              },
              {
                $match:{_id:branchId_list[j]._id}
              },
              {
                $project: {
                  _id: 0,
                  "belongedToDepart._id": 1,
                },
              },
            ]);
          
            if(br[0].belongedToDepart[0]._id==ques.depart_id){
                break;
            }
                
          }
          ques.branch_id = branchId_list[j]._id;
          ques.statement = {
              stem: data[i].stem,
              options: data[i].options.split('$'),
              right_answer:data[i].right_answer,
          }
   
          if("undefined" == typeof data[i].analysis || data[i].analysis===null)
              ques.analysis='';
          else
              ques.analysis = data[i].analysis;
          if("undefined" == typeof data[i].knowlege || data[i].knowlege===null)
              ques.knowlege='';
          else
              ques.knowlege = data[i].knowlege;
       
          ques.grade = data[i].grade;
  
          var images,voices,videos;
          if(data[i].images==null)
              images=[];
          else 
              images = data[i].images.split('$')
          if(data[i].voices==null)
              voices=[];
          else
             voices=data[i].voices.split('$')
          if(data[i].videos==null)
             videos=[];
          else
             videos=data[i].videos.split('$')
          ques.attachment = {
              image:images,
              voice:voices,
              video:videos,
        
          }
          await ques.save();
          
         
        }res.status(200).json({
          status: "success",
        });
       
    } catch (err) {
          res.status(404).json({ status: "fail", message: err });console.log(err)
    }
  }