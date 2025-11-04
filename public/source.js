function showSignUp(){
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.signup').style.display = 'flex';
}

function showLogin(){
    document.querySelector('.signup').style.display = 'none';
    document.querySelector('.login').style.display = 'flex';   
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.signup').style.display = 'none';

    document.querySelector('.formEleLogin').addEventListener('submit',(event)=>{
        event.preventDefault();
        const name = event.target.querySelector('[name="userName"]').value;
        const password = event.target.querySelector('[name="password"]').value;
        const email = event.target.querySelector('[name="email"]').value;
        const nameRegex = /^\S+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_].).{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email|| !password){
            alert("Please enter all the fields");
            return;
        }

        if (name != ""){
            if (nameRegex.test(name) != true){
                alert("User name cannot contain white spaces");
                return;
            }
        }

        if (password != ""){
            if (passwordRegex.test(password) != true){
                alert(
                    "Password does not adhere to the following requirements"+"\n"+
                    "1. Must containst at least 8 characters"+"\n"+
                    "2. Must contain at least one upper case character"+"\n"+
                    "3. Must contain at least one lower case character"+"\n"+
                    "4. Must contain at least one digit"+"\n"+
                    "5. Must contain at least one special character"+"\n"
                );
                return;
            }
        }

        if (email != ""){
            if (emailRegex.test(email) != true){
                alert("Invalid email address.");
                return;
            } 
        }

        axios.post('http://localhost:3000/api/users/createUser',
        { name , email , password }
        )
        .then( response =>{
            if(response.status === 201 && response.data.success){
                alert("You can now login to your account");
                showLogin()
            }
        })
        .catch( error => {
            console.error("Something went wrong."+"\n"+"Error : "+error);
            alert("Something went wrong , could not create user.");
        })

        document.querySelectorAll('[name="userName"],[name="password"],[name="email"]').forEach(ele => {
        ele.value="";   
        });
    })

    document.querySelector('.formEle').addEventListener('submit',(event)=>{
        event.preventDefault();
        const password = event.target.querySelector('[name="password"]').value;
        const email = event.target.querySelector('[name="email"]').value;

        if ( email === "" || password === "" ){
            alert("Please enter all the fields");
        }

        axios.post('http://localhost:3000/api/users/login',
        { email , password }
        )
        .then( response =>{
            if(response.status === 201 && response.data.success){
                alert("Login successful");
                setTimeout(() => {
                    window.location.href = "dashBoard.html";
                }, 1000);
                sessionStorage.setItem("userName", response.data.name);
                sessionStorage.setItem("userCred", response.data.role);

            }
        })
        .catch( error => {
            console.error("Something went wrong."+"\n"+"Error : "+error);
            alert("Wrong email or password");
        })

        document.querySelectorAll('[name="userName"],[name="password"],[name="email"]').forEach(ele => {
        ele.value="";   
        });
    })
});