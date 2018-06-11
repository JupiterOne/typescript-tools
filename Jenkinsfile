#!groovy

pipeline {
  agent none

  options {
    ansiColor("xterm")
    timestamps()
  }

  stages {
    stage('Builder') {
      agent none
      steps {
        script {
          builderNode {
            stage('Prepare') {
              checkout scm
              sh '''
              yarn install
              '''
            }

            parallel(
              'Lint': {
                stage('Lint') {
                  sh 'yarn lint'
                }
              },

              'Test': {
                stage('Test') {
                  sh 'yarn test:ci'
                }
              },

              'Security Scan': {
                stage('Security Scan') {
                  securityScan()
                }
              }
            )

            if (env.BRANCH_NAME == 'master') {
              stage('Publish') {
                sh '''
                ./node_modules/@lifeomic/dev-tools/bin/lifeomic-publish-npm-package --publish-tagged-commits-only
                '''
                updateDependentProjects()
              }
            }
          }
        }
      }
    }
  }
}
