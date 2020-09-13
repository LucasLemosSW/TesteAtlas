const url = "https://api.github.com/users";
const client_id = "Iv1.3b752cd81db99f9c";
const client_secret = "d20dcf4c0128ea61b2ead9f770cdd12017647259";
const count = 7;
const sort ="created: asc";

(function(){

    const profile= document.getElementById("profile");

    // função pra ler querystring
    function queryString(parameter) {  
        var loc = location.search.substring(1, location.search.length);   
        var param_value = false;   
        var params = loc.split("&");   
        for (i=0; i<params.length;i++) {   
            param_name = params[i].substring(0,params[i].indexOf('='));   
            if (param_name == parameter) {                                          
                param_value = params[i].substring(params[i].indexOf('=')+1)   
            }   
        }   
        if (param_value) {   
            return param_value;   
        }   
        else {   
            return undefined;   
        }   
    }

    var usuario = queryString("profile");
    console.log(usuario);

    async function getUser(user){
        const profileResponse = await fetch(
            `${url}/${user}?client_id=${client_id}&client_secret=${client_secret}`
        );

        const repoResponse = await fetch (
            `${url}/${user}/repos?per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}`
        );
        
        const profile = await profileResponse.json();
        const repos = await repoResponse.json();
        return {profile,repos};
    }

    function showProfile(user){
        profile.innerHTML += `
        <div  class="row mt-3 ml-0">
            <div class="col-md8">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${user.avatar_url}" alt="foto usuario">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><span class="badge-success">${user.login}</span></li>
                    </ul>
                    <a href="profile.html?profile=${user.login}" target="_blanck">perfil</a>
                </div>
            </div>
            <div class="col-md-8">
                <div id="repos"></div>
            </div>
        </div>`;
    }

    getUser(usuario).then(res=> {
        console.log(res.profile);
        showProfile(res.profile);
    });

})();