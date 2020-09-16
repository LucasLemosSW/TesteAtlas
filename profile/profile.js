const url = "https://api.github.com/users";
const client_id = "Iv1.3b752cd81db99f9c";
const client_secret = "d20dcf4c0128ea61b2ead9f770cdd12017647259";
const count = 8;
const sort ="created: asc";

(function(){

    const nomeImagemPerfil= document.getElementById("nome-imagem-perfil");
    const dadosPerfil= document.getElementById("dados-perfil");
    const biografia= document.getElementById("biografia");
    const repositorios= document.getElementById("repositorios");
    const carregando= document.getElementById("carregando");
    
    const projetos= document.getElementById("projetos");
    const selectSobre= document.getElementById("selectSobre");
    const selectProjetos= document.getElementById("selectProjetos");

    var renderInit=8;

    

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
    // console.log(usuario);

    async function getUser(user){
        const profileResponse = await fetch(
            `${url}/${user}?client_id=${client_id}&client_secret=${client_secret}`
        );

        const repoResponse = await fetch (
            // `${url}/${user}/repos?per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}`
            `${url}/${user}/repos?per_page=500&client_id=${client_id}&client_secret=${client_secret}`
        );
        
        const profile = await profileResponse.json();
        const repos = await repoResponse.json();
        return {profile,repos};
    }

    getUser(usuario).then(res=> {
        // console.log(res.repos);
        showProfile(res.profile);
        showFollower(res.profile);
        showBio(res.profile);
        showRepos(res.repos,renderInit);
    });

    selectSobre.addEventListener("click", ()=>{
        projetos.classList.add("hide");
        biografia.classList.remove("hide");
    });

    selectProjetos.addEventListener("click", ()=>{
        projetos.classList.remove("hide");
        biografia.classList.add("hide");
    });

    $(window).scroll(function() {
        
        if($(this).scrollTop() + $(this).height() == $(document).height()) {
            renderInit+=8;
            carregando.classList.remove("hide");
            // carregando.classList.add("carregando");
            getUser(usuario).then(res=> {
                showRepos(res.repos,renderInit);
                carregando.classList.add("hide");
            });
        }
    });

    function showProfile(user){
        nomeImagemPerfil.innerHTML = `
                <div id="container-img-perfil">
                    <img id = "img-perfil" class="card-img-top rounded-circle " src="${user.avatar_url}" alt="foto usuario">
                </div>
                <div class="nome-nick" >
                    <h1>${user.name}</h1>
                    <div style="display: flex; align-self: flex-end;">
                        <img class="img-icones" src="../images/nick.png" alt="projetos">
                        <h8>${user.login}</h8>
                    </div>
                </div>`;
    }

    function showFollower(user){
        dadosPerfil.innerHTML = `
        <div class="nome-nick">
            <div style="display: flex; justify-content: center; align-items: center; height: 50%;">
                <img class="img-icones" src="../images/seguindo.png" alt="seguindo">
                <h8>${user.following}</h8>
            </div>
            <h6>Seguindo</h6>
        </div>
        <div class="nome-nick">
            <div style="display: flex; justify-content: center; align-items: center; height: 50%;">
                <img class="img-icones" src="../images/projetos.png" alt="projetos">
                <h8>${user.public_repos}</h8>
            </div>
            <h6>Projetos</h6>
        </div>
        <div class="nome-nick">
            <div class="seguindo-projetos-seguidores" >
                <img class="img-icones" src="../images/seguidores.png" alt="seguidores">
                <h8>${user.followers}</h8>
            </div>
            <h6>Seguidores</h6>
        </div>`;
    }

    function showBio(user){
        let bio='',local='',blog='';
        if(user.bio==null)
            bio="Não há biografia =/";
        else
            bio=user.bio;
        
        if(user.location==null)
            local="Localidade não informada";
        else
            local=user.location;
        if(user.blog==null)
            blog="Não possui blog";
        else
            blog=user.blog;
        biografia.innerHTML =`                    
        <div>
            <h2>Bio</h2>
            <p>${bio}</p>
        </div>
        <div>
            <div style="display: flex;">
                <img class="img-icones" src="../images/home.png" alt="Cidade">
                <a href="#"> ${local}</a>
            </div>
            <div style="display: flex;">
                <img class="img-icones" src="../images/url.png" alt="Cidade">
                <a href="${blog}"> ${blog}</a>
            </div>
        </div>`;
    }

    function showRepos(repos,render){
        let output ='';
        let date,language,description,countRenderize=0;

            for(countRenderize;countRenderize<(render);countRenderize++){

                if(countRenderize<(repos.length)){

                    date = new Date(repos[countRenderize].updated_at);
                    if(repos[countRenderize].language==null)
                        language="Linguagem não informada."
                    else
                        language=repos[countRenderize].language;

                    if(repos[countRenderize].description==null)
                        description="Não há descrição."
                    else
                        description=repos[countRenderize].description;
                    output+=`
                    <li class="list-group-item">
                        <div class="row center">
                            <div class="col-md-8">
                                <a href="${repos[countRenderize].html_url}">${repos[countRenderize].name}</a>
                                <p>${description}</p>
                            </div>
                            <div class="col-md-3" >
                                <p>${language}</p>
                                <p>Atualizado em ${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}</p>
                            </div>
                        </div>
                    </li>`;                
                }
            }
        repositorios.innerHTML=output;
    }

})();