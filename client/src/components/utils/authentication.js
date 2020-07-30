class Authentication{
    constructor(){
        this.auhenticated = true; //When deployed, set to false
    }

    login(callback){
        this.auhenticated = true;
        callback();
    }

    logout(callback){
        this.auhenticated = false;
        callback();
    }

    isAuthenticated(){
        return this.auhenticated;
    }

}

export default new Authentication();