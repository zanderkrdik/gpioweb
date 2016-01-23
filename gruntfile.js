/**
 * Gruntfile
 * 
 * Tasks:
 *  deploy - packages, deploys to pi, installs on pi, runs on pi 
 *  devdeploy - pushes module code (but not node_modules), runs on pi
 */



module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // grunt_ssh_config.json ----------------------------------------------
        // required json: 
        // {host: XXX.XXX.XXX.XXX, username: XXX, password: XXX}
        ssh_config: grunt.file.readJSON('grunt_ssh_config.json'),

        // grunt-contrib-jshint -----------------------------------------------
        jshint: {
            files: ['/*.js','lib/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    //jQuery: true
                }
            }
        },
        
        // grunt-ssh ----------------------------------------------------------
        sftp: {
            devdeploy: {
                files: {
                    "./": ["./*.js","lib/*.js"]
                },
                options: {
                    path: '<%=ssh_config.directory%>/<%=pkg.name%>',
                    host: '<%= ssh_config.host %>',
                    username: '<%= ssh_config.username %>',
                    password: '<%= ssh_config.password %>',
                    showProgress: true,
                    srcBasePath: "dist/",
                    createDirectories: true
                }
            },
            deploy: {
                files: {
                    "./": ["deploy/*.tgz"]
                },
                options: {
                    path: '<%=ssh_config.directory%>',
                    host: '<%= ssh_config.host %>',
                    username: '<%= ssh_config.username %>',
                    password: '<%= ssh_config.password %>',
                    showProgress: true,
                    srcBasePath: "deploy/",
                    createDirectories: true
                }
            },

        },
        sshexec: {
            clean: {
                cwd: 'pinodes',
                command: 'cd <%=ssh_config.directory%>; rm -rf <%=pkg.name%>',
                options: {
                    host: '<%= ssh_config.host %>',
                    username: '<%= ssh_config.username %>',
                    password: '<%= ssh_config.password %>'
                }
            },
            deploy: {
                command: 
                    ['cd <%=ssh_config.directory%>;' +
                    'npm i --production ./package.tgz;' +
                    'mv node_modules/<%=pkg.name%> ./;' +
                    'mv node_modules <%=pkg.name%>/;' +
                    'rm -rf package.tgz'],
                    
                options: {
                    host: '<%= ssh_config.host %>',
                    username: '<%= ssh_config.username %>',
                    password: '<%= ssh_config.password %>'
                }
            },
            run: {
                command: ' cd <%=ssh_config.directory%>/<%=pkg.name%>; sudo node index.js',
                options: {
                    host: '<%= ssh_config.host %>',
                    username: '<%= ssh_config.username %>',
                    password: '<%= ssh_config.password %>'
                }
            },

        },
        // grunt-contrib-concat -----------------------------------------------
        concat: {
            options: {
                stripBanners: true,
                separator: '\n\n',
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js',
            },
        },
        // grunt-contrib-uglify -----------------------------------------------
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! Package: <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: true,
                mangle: true
            },
            mangle: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist'
                }]
            },
        },
        // grunt-contrib-clean ------------------------------------------------
        clean: ["dist", "build", "deploy"],
        exec: {
            npm_pack: {
                cmd: 'npm pack'
            },
            mkdir: {
                cmd: 'mkdir -p deploy'
            },
            mv: {
                cmd: 'mv *.tgz deploy/package.tgz'
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-exec');



    grunt.registerTask('default', ['jshint', 'clean', 'uglify']);
    grunt.registerTask('package', ['jshint','clean', 'exec:npm_pack', 'exec:mkdir', 'exec:mv'])
    grunt.registerTask('deploy', ['package', 'sshexec:clean','sftp:deploy', 'sshexec:deploy', 'sshexec:run'])
    grunt.registerTask('devdeploy', ['jshint', 'clean','sftp:devdeploy','sshexec:run'])

};
