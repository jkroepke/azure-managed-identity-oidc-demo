window.initAzure = () => {
    const cred = new ClientAssertionCredential(window.AZURE_TENANT_ID, window.AZURE_CLIENT_ID, console.log)
    console.log(cred.getToken())
}

window.initKeycloak = () => {
    const keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'demo',
        clientId: 'demo-frontend'
    });

    keycloak.init({
        checkLoginIframe: false,
        enableLogging: true,
        pkceMethod: "S256"
    }).then(function(authenticated) {

    }).catch(function(e) {
        console.log(e);
    });
    keycloak.onAuthSuccess = function() {
        document.getElementById('unauthenticated').style = 'display: none';
        document.getElementById('authenticated').style = '';
        window.AZURE_TENANT_ID = keycloak.tokenParsed.AZURE_TENANT_ID
        window.AZURE_CLIENT_ID = keycloak.tokenParsed.AZURE_CLIENT_ID

        keycloak.loadUserProfile().then(function(profile) {
            document.getElementById('jwt').innerText = keycloak.token
        }).catch(function(e) {
            console.log(e);
        });
    }
    document.getElementById('keycloak-login').onclick = keycloak.login;
    document.getElementById('azure-login').onclick = window.initAzure;
}
