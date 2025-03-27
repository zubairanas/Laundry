const { ApiResponse, generateToken , generateString } = require("../../Helpers");
const sanitizeUser = require("../../Helpers/sanitizeUser")
const User = require("../../Models/User");
const Referal = require("../../Models/referalCode")
const Reset = require("../../Models/Reset");
const {createResetToken ,validateResetToken } = require("../../Helpers/verification")
const { generateEmail} = require("../../Helpers/email")
//register
exports.register = async (req, res) => {
    const { firstName, lastName, email, password , phoneNumber } = req.body;
    // if(!req.file){
    //     return res.status(404).json(ApiResponse({}, "User image is required", false));
    // }
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json(ApiResponse({}, "User with this Email Already Exist", false));
        }

        user = new User({
            // firstName,
            // lastName,
            email,
            password,
            role: "USER",
            status: "ACTIVE",
            // phoneNumber,
            // image : req.file?.path?.replace(/\\/g, "/")
        });

        await user.save();

        let referalData = {
          code :"user"+"_"+Math.floor(Math.random() * 1000000),
          discount : 0.10,
          user : user._id
        }
        await Referal.create(referalData)

        return res
            .status(200)
            .json(
                ApiResponse(
                    { user },
                    true,
                    "User Created Successfully"
                )
            );
    } catch (error) {
      console.log(error)
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};


//signin
exports.signin = async (req, res) => {
    const { email, password } = req.body;
 
    try {
        User.findOne({ email, role: "USER" }).then((user) => {
          
            if (!user) {
                return res.json(ApiResponse({}, "USER with this email not found", false));
            }
            if (!user.authenticate(password)) {
                return res.json(ApiResponse({}, "Invalid password!", false));
            }
            if(user.status != "ACTIVE"){
              return res.json(ApiResponse({}, "USER is not Active", false));
            }
            const token = generateToken(user);

            return res.json(ApiResponse({ user: sanitizeUser(user), token }, "User Logged In Successfully", true));
        })
            .catch((err) => {
                return res.json(ApiResponse({}, err.message, false));
            });
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// //email verification code
// exports.emailVerificationCode = async (req, res) => {
//     try {
//       let { email } = req.body;
//       let verificationCode = generateString(4, false, true);
//       console.log("verificationCode", verificationCode);
//       await createResetToken(email, verificationCode);
//       const encoded = Buffer.from(
//         JSON.stringify({ email, code: verificationCode }),
//         "ascii"
//       ).toString("base64");
//       const html = `
//                   <div>
//                     <p>
//                       You are receiving this because you (or someone else) have requested the reset of the
//                       password for your account.
//                     </p>
//                     <p>Your verification status is ${verificationCode}</p>
//                     <p>
//                       <strong>
//                         If you did not request this, please ignore this email and your password will remain
//                         unchanged.
//                       </strong>
//                     </p>
//                   </div>
//       `;
//       await generateEmail(email, "WrightCo Academy LMS - Password Reset", html);
//       return res.status(201).json({
//         message:
//           "Recovery status Has Been Emailed To Your Registered Email Address",
//         encodedEmail: encoded,
//       });
//     } catch (err) {
//       res.status(500).json({
//         message: err.toString(),
//       });
//     }
//   };
  
  //email verification code
exports.emailVerificationCode = async (req, res) => {
  try {
    let { email } = req.body;
    const checkedUser = await User.findOne({ email : email })
    if(!checkedUser){
      return res
        .status(400)
        .json(ApiResponse({}, "This User Does not exist", false));
    }
    let verificationCode = generateString(4, false, true);
    console.log("verificationCode", verificationCode);
    await createResetToken(email, verificationCode);
    const encoded = Buffer.from(
      JSON.stringify({ email, code: verificationCode }),
      "ascii"
    ).toString("base64");
    const html = `
                <div>
                  <p>
                    You are receiving this because you (or someone else) have requested the reset of the
                    password for your account.
                  </p>
                  <p>Your verification status is ${verificationCode}</p>
                  <p>
                    <strong>
                      If you did not request this, please ignore this email and your password will remain
                      unchanged.
                    </strong>
                  </p>
                </div>
    `;
    await generateEmail(email, "Laundry - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address",
      encodedEmail: encoded,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

  //verify recover code
  exports.verifyRecoverCode = async (req, res) => {
    try {
      const { code, email } = req.body;
      const isValidCode = await validateResetToken(code, email);
  
      if (isValidCode) {
        return res
          .status(200)
          .json(ApiResponse({}, "Verification Code Verified", true));
      } else
        return res
          .status(400)
          .json(ApiResponse({}, "Invalid Verification Code", false));
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  
  //reset password
  exports.resetPassword = async (req, res) => {
    try {
      const { password, confirm_password, code, email } = req.body;
  
      const reset_status = await validateResetToken(code, email);
  
      if (!reset_status) {
        return res
          .status(400)
          .json(ApiResponse({}, "Verification Code dosent Match Email", false));
      }
  
      let user = await User.findOne({ email });
  
      await Reset.deleteOne({ code: code, email: email });
  
      user.password = password;
      await user.save();



  
      await res
        .status(201)
        .json(ApiResponse({}, "Password Updated Successfully", true));
    } catch (err) {
      res.status(500).json(ApiResponse({}, err.toString(), false));
    }
  };


  // exports.dogRegister = async (req,res) => {
  //   const { name ,gender , DOB , userid , petType } = req.body
  //   try{
       
  //       const data = {
  //           gender , 
  //           name ,
  //           DOB , 
  //           petType ,
  //           petImage : req.file.path.replace(/\\/g, "/")
  //       }

  //     const PetProfile =  await Pet.create(data)

  //     await User.updateOne(
  //       {_id : userid},
  //       {$push: { petid : PetProfile._id.toString()  }},
  //       {new : true})
        
  //     return res
  //     .status(200)
  //     .json(
  //         ApiResponse(
  //             { PetProfile },
  //             true,
  //             `${PetProfile.petType} Profile Created Successfully`
  //         )
  //     );

  //   }catch(error){
  //       return res.status(500).json(ApiResponse({}, error.message, false));
  //   }
  // }
  

  exports.userProfile = async (req,res) => {
    const { _id } = req.user
    try{
      const userProfile = await User.findById(_id).select("role image firstName lastName email phoneNumber")
      return res
      .status(200)
      .json(
          ApiResponse(
              { userProfile },
              true,
              "User Profile Fetched Successfully"
          )
      );

    }catch(error){
      return res.status(500).json(ApiResponse({}, error.message, false));
    }
  }

  exports.editProfile = async (req,res) => {
    const {_id} = req.user
    try{

      const {firstName , lastName , phoneNumber } = req.body

      const updateObj = {};

      if(firstName) updateObj.firstName = firstName;
      if(lastName) updateObj.lastName = lastName;
      if(phoneNumber) updateObj.phoneNumber = phoneNumber;
      if(req.file) updateObj.image = req.file.path.replace(/\\/g, "/");

      
    
    const updateProfile =  await User.findByIdAndUpdate(
        _id,
        {$set :  updateObj },
        {new : true}
      );

      return res
      .status(200)
      .json(
          ApiResponse(
              { updateProfile },
              true,
              "Profile Updated Successfully"
          )
      );
    }catch(error){
      return res.status(500).json(ApiResponse({}, error.message, false));
    }
  }

  exports.changePassword = async (req,res) => {
  const { _id } = req.user
  const { password } = req.body
try{
  let user = await User.findOne({ _id })

 
  user.password = password
  await user.save();


   res
  .status(201)
  .json(ApiResponse({}, "Password Updated Successfully", true));
}catch(error){
  return res.status(500).json(ApiResponse({}, error.message, false));
}
}

