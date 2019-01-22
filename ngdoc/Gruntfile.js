module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
	    ngdocs: {
	      options: {
	        scripts: ['angular.js'],
	        html5Mode: false
	      },
	      all: ['../lotte/resources_dev/**/*.js']
	    },
	    connect: {
	      options: {
	        keepalive: true
	      },
	      server: {}
	    },
	    clean: ['docs']
	  });

  grunt.registerTask('default', ['clean', 'ngdocs', 'connect']);

  
  
};
