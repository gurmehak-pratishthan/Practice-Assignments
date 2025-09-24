
import users from "../Data/UserData.json" with { type: "json" };


    // Controller to get all users
    export const getAllUsers = (req, res) => {
    res.json(users);
    }

    export const createUser = (req, res) => {
        // const newUser = req.body;
        // newUser = {id: users.length + 1, ...newUser };
        const newUser = { id: users.length + 1, ...req.body };

        // newUser.id = users.length + 1; // Simple ID assignment
        users.push(newUser);
        res.send(`User created successfully with first name: ${newUser.firstName} `);
    }

    export const getUserById = (req, res) => {
        const { id } = req.params;
        const user = users.find(user => user.id === parseInt(id));
        if (user){
            res.json(user);
        } else {
            res.send("User not found");
        }

    }

    export const deleteUser = (req, res) => {
        const {id} = req.params;
        const user = users.find(user => user.id ===parseInt(id));
        if (user){
            users.filter(user => user.id !== parseInt(id));
            res.send(`User with id ${id} deleted successfully`);    
        }
        else{
            res.send("User not found");
        }
    }
    export const updateUser = (req, res) => {
        const {id} = req.params;
        const user = users.find(user => user.id === parseInt(id));
        if (user){
            const {firstName, lastName, age} = req.body;
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (age) user.age = age;
        }
        else {
            res.send("User not found");
        }
        res.send(`User with id ${id} updated successfully`);
    }   


