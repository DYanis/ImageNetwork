var data = (function() {
    const USERNAME_STORAGE_KEY = 'username-key',
        AUTH_KEY_STORAGE_KEY = 'auth-key-key';

    function validateUsername(username) {
        if (typeof username.toString() !== 'string') {
            return false;
        }

        if ($.trim(username).length < 5 || $.trim(username).length > 30) {
            return false;
        }

        // if (/^[a-zA-Z0-9_]*$/.test(username)) {
        //     return false;
        // }

        return true;
    };

    function registerUser(user) {
        var promise = new Promise(function(resolve, reject) {
            if (!validateUsername(user.username)) {
                console.log(user.username);
                alert('username is in invalid format!');
                return;
            }
            var reqUser = {
                username: user.username,
                passHash: CryptoJS.SHA1(user.password).toString()
            };

            $.ajax({
                url: 'api/users',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(reqUser),
                success: function(user) {
                    resolve(user);
                },
                error: function(textStatus, errorThrown) {
                    alert("this name is used!");
                }
            });
        });

        return promise;
    }

    function loginUser(user) {
        var promise = new Promise(function(resolve, reject) {
            if (!validateUsername(user.username)) {
                alert('usernam is in invalid format!');
                return;
            }
            var reqUser = {
                username: user.username,
                passHash: CryptoJS.SHA1(user.password).toString()
            }

            $.ajax({
                url: 'api/auth',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(reqUser),
                success: function(user) {
                    localStorage.setItem(USERNAME_STORAGE_KEY, user.result.username);
                    localStorage.setItem(AUTH_KEY_STORAGE_KEY, user.result.authKey);
                    resolve(user);
                },
                error: function() {
                    alert('Name or password is incorect!')
                }
            });
        });
        return promise;
    }

    function userLogout() {
        var promi = new Promise(function(resolve, reject) {
            localStorage.removeItem(AUTH_KEY_STORAGE_KEY);
            localStorage.removeItem(USERNAME_STORAGE_KEY);
            resolve();
        })
    };

    function getAllCookies() {
        var promise = new Promise(function(resolve, reject) {

            $.ajax({
                url: 'api/cookies',
                method: 'GET',
                success: function(res) {
                    resolve(res);
                }
            })
        });

        return promise;
    };

    function createCokie(cookieInfo) {
        var promise = new Promise(function(resolve, reject) {
            var reqCookie;

            if (cookieInfo.imgUrl === null) {
                reqCookie = {
                    text: cookieInfo.text,
                    category: cookieInfo.category,
                };
            } else {
                reqCookie = {
                    text: cookieInfo.text,
                    category: cookieInfo.category,
                    img: cookieInfo.imgUrl
                }
            }

            $.ajax({
                url: 'api/cookies',
                method: 'POST',
                data: JSON.stringify(reqCookie),
                headers: {
                    'x-auth-key': localStorage.getItem(AUTH_KEY_STORAGE_KEY)
                },
                contentType: 'application/json',
                success: function(res) {
                    resolve(res);
                }
            })
        });

        return promise;
    };

    function likeCookie(obj) {
        var promise = new Promise(function(resolve, reject) {
            var mkLike = {
                type: 'like',
            }

            $.ajax({
                url: 'api/cookies/' + obj.id,
                method: 'PUT',
                data: JSON.stringify(mkLike),
                contentType: 'application/json',
                headers: {
                    'x-auth-key': localStorage.getItem(AUTH_KEY_STORAGE_KEY)
                },
                success: function(res) {
                    resolve(res);
                }
            })
        })

        return promise;
    }

    function dislikeCookie(obj) {
        var promise = new Promise(function(resolve, reject) {
            var mkLike = {
                type: 'dislike',
            }

            $.ajax({
                url: 'api/cookies/' + obj.id,
                method: 'PUT',
                data: JSON.stringify(mkLike),
                contentType: 'application/json',
                headers: {
                    'x-auth-key': localStorage.getItem(AUTH_KEY_STORAGE_KEY)
                },
                success: function(res) {
                    resolve(res);
                }
            })
        })

        return promise;
    }

    function getMyHourlyFortuneCookie() {
        var promise = new Promise(function(resolve, reject) {

            $.ajax({
                url: 'api/my-cookie',
                method: 'GET',
                headers: {
                    'x-auth-key': localStorage.getItem(AUTH_KEY_STORAGE_KEY)
                },
                success: function(res) {
                    resolve(res);
                },
                error:function (argument) {
                    alert("Don't have any cookies!");
                }
            })
        })

        return promise;
    }

    function getCurrentUser() {
        var username = localStorage.getItem(USERNAME_STORAGE_KEY);
        if (!username) {
            return null;
        }
        return {
            username
        };
    }

    function getAllUsers() {
        var promise = new Promise(function(resolve, reject) {

            $.ajax({
                url: 'api/users',
                method: 'GET',
                headers: {
                    'x-auth-key': localStorage.getItem(AUTH_KEY_STORAGE_KEY)
                },
                success: function(res) {
                    resolve(res);
                },
                error:function (argument) {
                    //alert("Don't have any cookies!");
                }
            })
        })

        return promise;
    }

    function getCookieById(id) {
        var promise = new Promise(function(resolve, reject) {

            $.ajax({
                url: 'api/cookies',
                method: 'GET',
                success: function(res) {
                    res.result.forEach(function (cookie) {
                        if (cookie.id === id) {
                            resolve(cookie);
                        }
                    })
                },
                error:function (argument) {
                    //alert("Don't have any cookies!");
                }
            })
        })

        return promise;
    }

    return {
        users: {
            register: registerUser,
            login: loginUser,
            logout: userLogout,
            current: getCurrentUser,
            getAll: getAllUsers,
        },
        cookie: {
            create: createCokie,
            getAll: getAllCookies,
            like: likeCookie,
            disLike: dislikeCookie,
            getCookie: getMyHourlyFortuneCookie,
            getById: getCookieById,
        }
    }
}());
