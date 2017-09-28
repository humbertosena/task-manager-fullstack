module.exports = {
    "env": {
        "browser": true,
        "jasmine": true,
        "es6": true
    },
    "globals": {
      "angular": true,
      "$scope": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        //"strict": "error"
    }
};
