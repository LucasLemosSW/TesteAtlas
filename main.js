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

    function showProfile(user){
        profile.innerHTML += `
        <div  class="row mt-3">
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
                showProfile(res.profile);
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

        imgCarregadas=2;
        getAllUsers().then(res=> {
            for(cont=0;cont<imgCarregadas;cont++){
                getUser(res.allProfiles[cont].login).then(res=> {
                    // console.log(res.profile);
                    showProfile(res.profile);
                });
            }
        });
    })

    $(window).scroll(function() {
        let imgCarregadasAtual=imgCarregadas;
        if($(this).scrollTop() + $(this).height() == $(document).height()) {
            loading.classList.remove("hide");
            imgCarregadas+=2;
            getAllUsers().then(res=> {
                for(cont=imgCarregadasAtual;cont<imgCarregadas;cont++){
                    getUser(res.allProfiles[cont].login).then(res=> {
                        loading.classList.add("hide");
                        console.log(res.profile);
                        showProfile(res.profile);
                    });
                }
            });
        }
    });

})();


