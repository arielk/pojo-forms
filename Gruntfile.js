/**
 * WP-Linker Makefile
 */
'use strict';

module.exports = function(grunt) {

	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON('package.json'),

		checktextdomain: {
			standard: {
				options:{
					text_domain: 'pojo-forms',
					keywords: [
						// WordPress keywords
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d'
					]
				},
				files: [ {
					src: [
						'**/*.php',
						'!node_modules/**',
						'!build/**',
						'!tests/**',
						'!vendor/**',
						'!*~'
					],
					expand: true
				} ]
			}
		},

		pot: {
			options:{
				text_domain: 'pojo-forms',
				dest: 'languages/',
				keywords: [
					// WordPress keywords
					'__:1',
					'_e:1',
					'_x:1,2c',
					'esc_html__:1',
					'esc_html_e:1',
					'esc_html_x:1,2c',
					'esc_attr__:1',
					'esc_attr_e:1',
					'esc_attr_x:1,2c',
					'_ex:1,2c',
					'_n:1,2',
					'_nx:1,2,4c',
					'_n_noop:1,2',
					'_nx_noop:1,2,3c'
				]
			},
			files:{
				src: [
					'**/*.php',
					'!node_modules/**',
					'!build/**',
					'!tests/**',
					'!vendor/**',
					'!*~'
				],
				expand: true
			}
		},

		bumpup: {
			options: {
				updateProps: {
					pkg: 'package.json'
				}
			},
			file: 'package.json'
		},

		replace: {
			plugin_main: {
				src: [ 'linker.php' ],
				overwrite: true,
				replacements: [
					{
						from: /Version: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
						to: 'Version: <%= pkg.version %>'
					}
				]
			},

			readme: {
				src: [ 'readme.txt' ],
				overwrite: true,
				replacements: [
					{
						from: /Stable tag: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
						to: 'Stable tag: <%= pkg.version %>'
					}
				]
			}
		},

		shell: {
			git_add_all : {
				command: [
					'git add --all',
					'git commit -m "Bump to <%= pkg.version %>"'
				].join( '&&' )
			}
		},

		release: {
			options: {
				bump: false,
				npm: false,
				commit: false,
				tagName: 'v<%= version %>',
				commitMessage: 'released v<%= version %>',
				tagMessage: 'Tagged as v<%= version %>'
			}
		},

		wp_readme_to_markdown: {
			github: {
				options: {
					gruntDependencyStatusUrl: 'https://david-dm.org/KingYes/wp-linker'
				},
				files: {
					'README.md': 'readme.txt'
				}
			}
		},

		copy: {
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!build/**',
					'!bin/**',
					'!.git/**',
					'!tests/**',
					'!.travis.yml',
					'!README.md',
					'!phpunit.xml',
					'!vendor/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules',
					'!*~'
				],
				dest: 'build/'
			}
		},

		clean: {
			//Clean up build folder
			main: [
				'build'
			]
		}
		
	} );

	// Default task(s).
	grunt.registerTask( 'default', [
		'checktextdomain',
		'pot',
		'wp_readme_to_markdown'
	] );

	grunt.registerTask( 'build', [
		'default',
		'clean',
		'copy'
	] );

	grunt.registerTask( 'publish', [
		'checktextdomain',
		'pot',
		'bumpup',
		'replace',
		'wp_readme_to_markdown',
		'shell:git_add_all',
		'release'
	] );
};