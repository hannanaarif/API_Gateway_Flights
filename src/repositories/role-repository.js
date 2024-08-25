const CrudRepository=require('./crud-repository');
const {Role}=require('../models');


class RoleRepository extends CrudRepository {
    constructor(){
        super(Role);
    }
    async getUserRoleByName(name){
        const user=await Role.findOne({where:{name:name}});
        return user
    }
}
module.exports=RoleRepository;