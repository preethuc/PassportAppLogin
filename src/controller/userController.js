import User from "./../model/userModel";
import cron from "node-cron"

//POST - create User (random password)
exports.createUser = async (req, res, next) => {
  try {
    let chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let string_length = 8;
    let randomstring = "";
    for (let i = 0; i < string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    let createData = await new User({
      user_name: req.body.user_name,
      full_name: req.body.full_name,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      passport_number: req.body.passport_number,
      passport_file: req.body.passport_file,
      password: randomstring,
    });

    createData.save();

    return res.status(201).json({
      status: "success",
      message: "created successfully",
      data: createData,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET - All User
exports.getUser = async (req, res, next) => {
  try {
    const getData = await User.find();
    return res.status(200).json({
      status: "success",
      message: "ALL USERS",
      result: getData.length,
      data: getData,
    });
  } catch (error) {
    console.log(error);
  }
};

//GET - User is Registered or not
exports.validateUser = async (req, res) => {
  // console.log(req.query.user_name );
  const user = await User.findOne({ user_name: req.query.user_name });
  if (user) {
    return res.status(200).json({
      message: "User has already registered, Please Login",
      userData: user,
    });
  } else {
    return res.status(200).json({
      message: "This name is not registered , Please Register the User",
    });
  }
};
//Check Admin or not And Admin - Passport verification
exports.adminPassportCheck = async (req, res) => {
    try {
      
    if (req.body.adminCheck) {
      if (req.body.accept) {
       return res.status(200).json({
          status: "Success",
          message: "Your passport has been verified",
        });
      } else if (req.body.reject === "rejected") {
        let user = await User.findById(req.body.id);
        let rejectionCount = user.no_of_rejection;
        rejectionCount.push(req.body.reject);

        const updateData = await User.findByIdAndUpdate(
          req.body.id,
          { login_reject: "reject", no_of_rejection: rejectionCount },
          { new: true }
        );
          console.log(updateData);
           

        if (updateData.no_of_rejection.length === 2) {
          res.status(400).json({
            message: "banned for 3 months",
          });
          three_months_ban();
        }

        if (updateData.no_of_rejection.length === 3) {
            res.status(400).json({
            message: "banned for 6 months",
          });
          six_months_ban();
        }

          if (updateData.no_of_rejection.length === 4) {
            twelve_months_ban();
          return res.status(400).json({
            message: "banned for 12 months",
          });
          
        }

        if (updateData.no_of_rejection.length >= 5) {
          const banUser = await User.findByIdAndUpdate(
            req.body.id,
            { permanent_ban: true },
            { new: true }
          );
          return res.status(400).json({
            message: "permanent ban ",
          });
        }
      res.status(400).json({
            message: "User Rejected",
            status:"rejected"
        })
      }
    } else {
      res.send("not an admin");
    }
  } catch (error) {
    res.send(error);
  }
};
//CRON Job - Ban function
exports.three_months_ban = async (req) => {
    cron.schedule("    /3 * ", async () => {
      let id = req.body.id;
      let updates = { logginReject: "accept" };
      let options = { new: true };
      const updateData = await User.findByIdAndUpdate(id, updates, options);
    });
  };
  
  exports.six_months_ban = async (req) => {
    cron.schedule("    /6 * ", async () => {
      let id = req.body.id;
      let updates = { logginReject: "accept" };
      let options = { new: true };
      const updateData = await User.findByIdAndUpdate(id, updates, options);
    });
  };
  
  exports.twelve_months_ban = async (req) => {
    cron.schedule("    /12 * ", async () => {
      let id = req.body.id;
      let updates = { logginReject: "accept" };
      let options = { new: true };
      const updateData = await User.findByIdAndUpdate(id, updates, options);
    });
  };
//Auth app code - random password for every 1 min
const authPassword = async (req)=>{

    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let string_length = 8;
    let randomstring = '';
    for (let i=0; i<string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    const updateData = await User.findByIdAndUpdate(req.params.id, {password:randomstring}, {new:true})
    

}
//Auth app password with Cron
exports.authPasswordCron = async (req, res)=>{
    try {
    
        cron.schedule(" */1 * * * *", ()=>{
            authPassword(req)
        })
      
        let user = await User.findById(req.params.id)
        res.status(200).json({
            message:` ${user.password} - auth app code for 1 minute`
        })
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
    }
}


// POST - Login
exports.userLogin = async (req, res) => {
  try {
      const user = await User.findOne({ user_name: req.body.user_name });
      
    if (user) {
      let userPasswords = user.password;
      const checkPassword = userPasswords.includes(req.body.password);
      if (checkPassword) {
        res.status(200).json({
          status: "success",
          message: "Successfully logged in",
        });
      } else {
        return res.send("Invalid, Please enter a valid Name and password");
      }
    } else {
      res.send("Invalid, Please enter a valid Name and password");
    }
  } catch (error) {
    res.send(error);
  }
};

//Permanent password for accepted user
exports.createPermanentPassword = async (req, res)=>{
    try {
        const user = await User.findOne({_id:req.body.id})
        if (user.login_reject === "reject") {
            res.status(200).json({
                message:"sorry you're not eligible to create permanent password"
            })
        } else {
           
            const updateData = await User.findByIdAndUpdate(req.body.id, {password:req.body.ownPassword}, {new:true})
            res.status(200).json({
                status:"success",
                message: "Your permanent password was Created",
                Data: {
                    user_name:updateData.user_name,
                    password: updateData.password,
                    
                }
            })
        }
    } catch (error) {
        res.send(error.message)
    }
}

