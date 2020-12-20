const user = {
    fname: 'first',
    lname: 'last',
    get bio() {
        console.log(`${this.fname} ${this.lname}`)
    },
    set bio(data) {
        [this.fname, this.lname] = data.split(" ")
    },
    userType(type = false) {
        this.isAdmin = type
    }
}
const admin = {
    fname: 'Admin',
    lname: 'Admin',
    _proto_: user
}