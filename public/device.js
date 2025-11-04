window.addEventListener("load",event =>{
    showDevices();
    const userCred = sessionStorage.getItem("userCred");

    document.querySelector(".deviceAddForm").addEventListener('submit',event =>{
        event.preventDefault();
        if (userCred === "admin"){
            addDevice(event);
        }
        else{
            alert("You do not have the right credentials to perform the edit operation");
        }
    })

    document.querySelector(".table").addEventListener('click',event =>{
        event.preventDefault();
        if(event.target.classList.contains("edit")){
            if (userCred === "admin"){
                
                const button = event.target;
                const device = {
                    name: button.dataset.name,
                    location: button.dataset.location,
                    topic: button.dataset.topic,
                    _id: button.dataset.id
                }
                populateForm(device);
            }
            else{
                alert("You do not have the right credentials to perform the edit operation");
            }
        }
    })

    document.querySelector(".table").addEventListener('click',event =>{
        event.preventDefault();
        if(event.target.classList.contains("delete")){
            if (userCred === "admin"){
                
                const button = event.target;
                const _id = button.dataset.id
                const result = confirm("Are you sure you want to delete this user ?");
                if(result){
                    deleteDevice(_id);
                }
            }
            else{
                alert("You do not have the right credentials to perform the edit operation");
            }
        }
    })

    document.querySelector(".editFormEle").addEventListener('click',event =>{
        formSubmit(event);
    })

    const logout = document.querySelector(".logout");
    logout.addEventListener("click",event =>{
        event.preventDefault();
        setTimeout(() => {
            alert("Logging out");
            window.location.href = "Index.html";
        }, 1000);
    });

    function addDevice(event){
        const name = event.target.querySelector("[name='deviceName']").value;
        const location = event.target.querySelector("[name='deviceLocation']").value;
        const topic = event.target.querySelector("[name='deviceTopic']").value;

        if( name ==="" || location ==="" ||topic ===""){
            alert("Please enter all the fields");
            return;
        }

        axios.post('http://localhost:3000/api/devices/createDevice',
            { name , location , topic }
        )
        .then(response =>{
            if (response.status === 201 && response.data.success === true){
                alert("Device added successfully");
                showDevices();
            }
        })
        .catch(error =>{
            alert("Could not add device.")
            console.error(error);
    })

        document.querySelectorAll('[name="deviceName"],[name="deviceLocation"],[name="deviceTopic"]').forEach(ele => {
        ele.value="";   
        });
    }

    function showDevices(){
        axios.get('http://localhost:3000/api/devices/findAllDevices')
        .then(response=>{
            const tbody = document.querySelector("tbody");
            const deviceArray = response.data;
            if(deviceArray.length <= 0){
                tbody.innerHTML = "";
            }
            else{
                tbody.innerHTML = "";
                deviceArray.forEach(device =>{
                    const tr = document.createElement("tr");
                    //tbody.innerHTML = "";
                    tr.innerHTML = `
                        <td>${device.name}</td>
                        <td>${device.location}</td>
                        <td>${device.topic}</td>
                        <td class = "actions">
                            <button class ="editBtn edit" 
                                data-name="${device.name}"
                                data-location="${device.location}"
                                data-topic="${device.topic}"
                                data-id="${device._id}"
                            >EDIT</button>
                            <button class ="editBtn delete" data-id="${device._id}" >DELETE</button>
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

    function populateForm(device){
        document.querySelector(".editForm").style.display="flex"
        console.log(device);
        document.querySelector("#editName").value = device.name;
        document.querySelector("#editId").value = device._id;
        document.querySelector("#editLocation").value = device.location;
        document.querySelector("#editTopic").value = device.topic;
    }

    function formSubmit(event){
        event.preventDefault();
        if (event.target.classList.contains("ok")){
            const name = document.querySelector("#editName").value;
            const location = document.querySelector("#editLocation").value;
            const topic = document.querySelector("#editTopic").value;
            const _id = document.querySelector("#editId").value;
            //const devices = document.querySelector("#devices").value.split(",").map(d => d.trim());

            axios.put('http://localhost:3000/api/devices/updateDeviceDetails',
                { name , location , topic , _id}
            )
            .then(response =>{
                if(response.status === 200 && response.data.success === true ){
                    alert("Device details updated successfully.");
                }
                showDevices()
            })
            .catch(error =>{
                alert("Could not update  device details");
                console.error(error);
            })

            document.querySelector(".editForm").style.display="none";
        }

        if (event.target.classList.contains("cancel")){
            document.querySelector(".editForm").style.display="none";
        }
    }

    function deleteDevice(_id){
        axios.delete('http://localhost:3000/api/devices/deleteDeviceDetails',{
            data : {_id}
        })
        .then(response =>{
            if (response.status === 200 && response.data.success === true){
                alert("Device has been deleted successfully");
                showDevices()
            }
        })
        .catch(error =>{
            alert("Could not delete device");
            console.error(error);
        })
    }

})