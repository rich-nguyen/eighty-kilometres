
function greeter(person: string) {
    console.log(person);
    return "Hello, " + person;
}

function run() {
    var user: string = "Jane User";
    document.body.innerHTML = greeter(user);
}

export default {
    run,
    greeter
}