const url = "https://api.github.com/users";
const client_id = "Iv1.3b752cd81db99f9c";
const client_secret = "d20dcf4c0128ea61b2ead9f770cdd12017647259";


(function(){

    const count = 7;
    const sort ="created: asc";

    const cabecalho = document.getElementById("cabecalho");
    const main= document.getElementById("main");
    const home= document.getElementById("home");
    const bloco= document.getElementById("bloco");
    
    const perfil = document.getElementById("perfil");
    const loading= document.getElementById("carregando");
    const msgFimLista= document.getElementById("msg-fim-lista");
    const search= document.getElementById("search");
    const search_home= document.getElementById("search_home");
    
    const buttonProfile= document.getElementById("buttonProfile");
    const profile= document.getElementById("profile");
    const search_all_main= document.getElementById("search_all");
    const search_all_home= document.getElementById("search_all_home");
    const search_each= document.getElementById("search_each");
    var imgCarregadas=2;


    async function getUser(user){
        const profileResponse = await fetch(
            `${url}/${user}?client_id=${client_id}&client_secret=${client_secret}`
        );

        // const repoResponse = await fetch (
        //     `${url}/${user}/repos?per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}`
        // );
        
        const profile = await profileResponse.json();
        // const repos = await repoResponse.json();
        // return {profile,repos};
        return {profile};
    }

    async function getAllUsers(){

        const allProfilesResponse = await fetch(
            `${url}`
        );

        const allProfiles = await allProfilesResponse.json();
        return {allProfiles};
    }
    


    search_each.addEventListener("click",()=>{
        saiDaHome();
        procuraEspecifico(search_home.value);
    })

    search.addEventListener("keyup", (e)=>{
        const user = e.target.value;
        procuraEspecifico(user);
    });

    search_home.addEventListener("keyup", (e)=>{
        if(e.target.value==null || e.target.value=="")
            search_each.disabled=true;
        else
            search_each.disabled=false;
    });

    $('#profile').on('click', '#perfil', function (event) {
        var botao = $(event);
        console.log("aaki");
        console.log(botao);
    });

    search_all_home.addEventListener("click",procuraTodos);

    $(window).scroll(function() {
        let imgCarregadasAtual=imgCarregadas;
        if($(this).scrollTop() + $(this).height() == $(document).height()) {
            
            
            getAllUsers().then(res=> {

                if(imgCarregadas<res.allProfiles.length){
                    loading.classList.remove("hide");
                    imgCarregadas+=10;
                    for(cont=imgCarregadasAtual;cont<imgCarregadas;cont++){
                        if(imgCarregadasAtual<res.allProfiles.length){
                            getUser(res.allProfiles[cont].login).then(res=> {
                                showProfile(res.profile,true);
                                setTimeout(function(){ loading.classList.add("hide"); }, 1000);
                            });
                        }else{
                            setTimeout(function(){ loading.classList.add("hide"); }, 1000);
                        }
                    }
                }else{
                    setTimeout(function(){ msgFimLista.classList.remove("hide"); }, 1000);
                    console.log("Já rendenizou todas");
                }
            });
        }
    });

    function procuraEspecifico(user){

        if(user.length>0){
            getUser(user).then(res=> {
                // console.log(res.profile);
                showProfile(res.profile,false);
            });
        }
            
    }
    
    function procuraTodos(){
        saiDaHome();
        imgCarregadas=10;
        profile.innerHTML= '';
        getAllUsers().then(res=> {
            for(cont=0;cont<imgCarregadas;cont++){
                getUser(res.allProfiles[cont].login).then(res=> {
                    // console.log(res.profile);
                    showProfile(res.profile,true);
                });
            }
        });
    }

    function saiDaHome(){
        home.classList.add("hide");
        main.classList.remove("hide");
        cabecalho.classList.remove("hide");
        bloco.classList.remove("hide");
    }

    function showProfile(user,all){
        // console.log(all);
        if(all){
            profile.innerHTML +=    `<div id="card-perfil-mobile" class=" card card-perfil" >
                                        <img id="img-perfil-card"class="card-img-top rounded-circle " src="${user.avatar_url}" alt="foto usuario">
                                        <a id="label-perfil-card" href="./profile/profile.html?profile=${user.login}" target="_blanck">${user.login}</a>
                                    </div>
                                `;

        }else{
            profile.innerHTML =    `<div id="card-perfil-mobile-busca" class="card card-perfil" >
                                        <img class="card-img-top rounded-circle w-75 m-3" src="${user.avatar_url}" alt="foto usuario">
                                        <a id="label-perfil-card" class="mb-3" href="./profile/profile.html?profile=${user.login}" target="_blanck">${user.login}</a>
                                    </div>
                                `;
        }

    }

})();


