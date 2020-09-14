const url = "https://api.github.com/users";
const client_id = "Iv1.3b752cd81db99f9c";
const client_secret = "d20dcf4c0128ea61b2ead9f770cdd12017647259";


(function(){

    const count = 7;
    const sort ="created: asc";
    
    const perfil = document.getElementById("perfil");
    const loading= document.getElementById("carregando");
    const search= document.getElementById("search");
    const buttonProfile= document.getElementById("buttonProfile");
    const profile= document.getElementById("profile");
    const search_all= document.getElementById("search_all");
    const search_each= document.getElementById("search_each");
    var imgCarregadas=2;


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

    async function getAllUsers(){

        const allProfilesResponse = await fetch(
            `${url}`
        );

        const allProfiles = await allProfilesResponse.json();
        return {allProfiles};
    }
    
    function showProfile(user,all){
        console.log(all);
        if(all){
            profile.innerHTML +=    `<div class="card card-perfil" >
                                        <img class="card-img-top rounded-circle w-75 m-3" src="${user.avatar_url}" alt="foto usuario">
                                        <a class="mb-3" href="./profile/profile.html?profile=${user.login}" target="_blanck">${user.login}</a>
                                    </div>
                                <!--  
                                    <div class="col-md-8">
                                        <div id="repos"></div>
                                    </div>
                                -->`;

        }else{
            profile.innerHTML =    `<div class="card card-perfil" >
                                        <img class="card-img-top rounded-circle w-75 m-3" src="${user.avatar_url}" alt="foto usuario">
                                        <a class="mb-3" href="./profile/profile.html?profile=${user.login}" target="_blanck">${user.login}</a>
                                    </div>
                                <!--  
                                    <div class="col-md-8">
                                        <div id="repos"></div>
                                    </div>
                                -->`;
        }

    }

    function showRepos(repos){
        let output ='';

        repos.forEach(repo =>{
            output+=`
            <div class="card card-body mb-2">
                <div class="row">
                    <div class="col-md-6"><a href="${repo.html_url}" target="_black">${repo.name}</a></div>
                    <div class="col-md-6">
                        <span class="badge-primary">starts: ${repo.stargazers_count}</span>
                        <span class="badge-success">watchers: ${repo.watchers_count}</span>
                        <span class="badge-warning">Forks: ${repo.forks_count}</span>
                    </div>
                </div>
            </div>`;
        });

        document.getElementById("repos").innerHTML=output;
    }

    search.addEventListener("keyup", (e)=>{
        const user = e.target.value;

        if(user.length>0){
            getUser(user).then(res=> {
                console.log(res.profile);
                showProfile(res.profile,false);
                //showRepos(res.repos);
            });
        }
            
    })

    $('#profile').on('click', '#perfil', function (event) {
        var botao = $(event);
        console.log("aaki");
        console.log(botao);
    });

    search_all.addEventListener("click", ()=>{

        imgCarregadas=10;
        // profile= '';
        getAllUsers().then(res=> {
            for(cont=0;cont<imgCarregadas;cont++){
                getUser(res.allProfiles[cont].login).then(res=> {
                    // console.log(res.profile);
                    showProfile(res.profile,true);
                });
            }
        });
    })

    $(window).scroll(function() {
        let imgCarregadasAtual=imgCarregadas;
        if($(this).scrollTop() + $(this).height() == $(document).height()) {
            loading.classList.remove("hide");
            imgCarregadas+=10;
            getAllUsers().then(res=> {
                for(cont=imgCarregadasAtual;cont<imgCarregadas;cont++){
                    getUser(res.allProfiles[cont].login).then(res=> {
                        loading.classList.add("hide");
                        console.log(res.profile);
                        showProfile(res.profile,true);
                    });
                }
            });
        }
    });

})();


