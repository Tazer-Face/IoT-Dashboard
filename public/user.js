window.addEventListener("load",function(event){
    showUserTable();
    const userCred = sessionStorage.getItem("userCred");

    const bodytag = document.querySelector("tbody");
    bodytag.addEventListener("click",function(event){
        if (event.target.classList.contains("edit")){
            if (userCred === "admin"){
                populateForm(event);
            }
            else{
                alert("You do not have the right credentials to perform the edit operation");
            }
        }
        if(event.target.classList.contains("delete")){
            if (userCred === "admin"){
                const result = confirm("Are you sure you want to delete this user ?");
                if(result){
                    deleteUser(event);
                }
            }
            else{
                alert("You do not have the right credentials to perform the edit operation");
            }
        }
    });

    const formTag = this.document.querySelector(".editFormEle");
    formTag.addEventListener("click",function(event){
        formSubmit(event);
    });

    const logout = document.querySelector(".logout");
    logout.addEventListener("click",event =>{
        event.preventDefault();
        setTimeout(() => {
            alert("Logging out");
            window.location.href = "Index.html";
        }, 1000);
    });

    document.querySelector(".userAddForm").addEventListener('submit',event =>{
        event.preventDefault();
        if (userCred === "admin"){
            addUser(event);
        }
        else{
            alert("You do not have the right credentials to perform the edit operation");
        }
    })

    function addUser(event){
        const name = event.target.querySelector('[name="userName"]').value;
        const password = event.target.querySelector('[name="userPassword"]').value;
        const email = event.target.querySelector('[name="userEmail"]').value;
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
                alert("New user has been added.");
                showUserTable()
            }
        })
        .catch( error => {
            console.error("Something went wrong."+"\n"+"Error : "+error);
            alert("Something went wrong , could not create user.");
        })

        document.querySelectorAll('[name="userName"],[name="userPassword"],[name="userEmail"]').forEach(ele => {
        ele.value="";   
        });
    }

    function showUserTable(){

        axios.get('http://localhost:3000/api/users/findAllusers')
        .then(response=>{
            const tbody = document.querySelector("tbody");
            const userArray = response.data;
            if(userArray.length <= 0){
                tbody.innerHTML = "";
                return;
            }
            else{
                tbody.innerHTML = "";
                userArray.forEach(user =>{
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.devices.map(d => d.name).join(', ')}</td>
                        <td class = "actions">
                            <button class ="editBtn edit">EDIT</button>
                            <button class ="editBtn delete">DELETE</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                })
            }
        })
        .catch(error=>{
            console.error("Error : "+error)
        })  
    }

    function deleteUser(event){
        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td")[1];
        const email = cells.textContent.trim();
        axios.delete('http://localhost:3000/api/users/deleteUserDetails',
            {data: { email}}
        )
        .then(response =>{
            if(response.status === 200 && response.data.success){
                alert("User has been deleted successfully");
                showUserTable();
            }
        })
        .catch(error =>{
            alert("Could not delete  user");
            console.error(error);
        })
    };


    function populateForm(event){

        document.querySelector(".editForm").style.display="flex"

        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");

        document.querySelector("#name").value = cells[0].textContent.trim();
        document.querySelector("#email").value = cells[1].textContent.trim();
        document.querySelector("#type").value = cells[2].textContent.trim();

        const deviceNames = cells[3].textContent.split(',').map(d => d.trim());

        axios.get('http://localhost:3000/api/devices/findAllDevices')
        .then(response =>{
            const devices = response.data;
            populateDevices(devices,deviceNames);
        })
        .catch(error =>{
            console.error(error);
        })
    }

    function formSubmit(event){
        event.preventDefault();
        if (event.target.classList.contains("ok")){
            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const role = document.querySelector("#type").value;
            const select = document.querySelector("#devices");
            const devices = Array.from(select.selectedOptions).map(opt => opt.value);
            
            axios.put('http://localhost:3000/api/users/updateUserDetails',
                { name , email , role , devices }
            )
            .then(response =>{
                if(response.status === 200 ){
                    alert("User details updated successfully.");
                }
                showUserTable();
            })
            .catch(error =>{
                alert("Could not update user details");
                console.error(error);
            })

            document.querySelector(".editForm").style.display="none";
        }

        if (event.target.classList.contains("cancel")){
            document.querySelector(".editForm").style.display="none";
        }
    }

    function populateDevices(data,deviceNames){
        const selectDiv = document.querySelector("#device");
        selectDiv.innerHTML = "";
        
        const select = document.createElement("select");
        select.id = "devices";
        select.setAttribute("multiple", "multiple");
        select.classList.add("scrollable-select");

        data.forEach(ele =>{
            const option = document.createElement("option");
            option.setAttribute("data-id", ele._id);
            option.value = ele._id;
            option.textContent = ele.name;

            if (deviceNames.includes(ele.name)) {
                option.selected = true;
            }
            select.appendChild(option);
        })
        
        selectDiv.appendChild(select);
    }

})
  