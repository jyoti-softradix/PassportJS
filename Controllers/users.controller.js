const db = require("../Models/index");
const Users = db.user;

//getAll user
function getAllUser(req, res) {
  Users.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

//get single user by Id
function getOneUser(req, res) {
  Users.findByPk(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

//update user
function updateUser(req, res) {
  const {body} = req;
  const newObj = {
    first_name:body.first_name,
    last_name: body.last_name,
    email: body.email,
  };
 Users.update(newObj, { where: { email: body.email } })
    .then((data) => {
      res.send("Updated data successfully", data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

//delete user
async function deleteUser(req, res) {
  const {params} = req;
  try {
    console.log(1);
    const getData = await Users.findOne({ where: { id: params.id } });
    console.log("getData", getData);
    if (getData && getData.length) {
      console.log(2);
      Users.destroy({ where: { id: params.id } });
      res.status(200).json({ message: "Deleted user successfully" });
    } else {
      res.status(400).json({ message: "user doesn't exist" });
    }
  } catch (err) {
    res.status(500).json("error", err.message);
  }
}

module.exports = {
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
};
