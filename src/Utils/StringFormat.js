String.prototype.format = function() {
    let args = arguments;
    return this.replace(String.prototype.format.regex, (item) => {
        let intVal = parseInt(item.substring(1, item.length - 1), 10);
        if (intVal >= 0) {
            return typeof args[intVal] !== 'undefined' ? args[intVal] : "";
        } else if (intVal === -1) {
            return "{";
        } else if (intVal === -2) {
            return "}";
        }
        return "";
    });
};
String.prototype.format.regex = new RegExp('{-?[0-9]+}', 'g');

String.prototype.formatObject = function(args) {
    return this.replace(String.prototype.formatObject.regex, (item) => {
        let key = item.substring(1, item.length - 1);
        if (key in args) {
            if (args[key]) {
                return args[key].toString();
            }
        }
        return "";
    });
};
String.prototype.formatObject.regex = new RegExp('{-?\\w+[^0-9]}', 'g');
