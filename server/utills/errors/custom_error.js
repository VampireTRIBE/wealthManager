class custom_error extends Error {
   constructor(status,msg) {
      super();
      this.status=status;
      this.message=msg;
   }
}
module.exports=custom_error;