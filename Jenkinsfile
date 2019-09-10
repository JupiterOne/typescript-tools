#!groovy

pipeline {
  agent none

  options {
    ansiColor('xterm')
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Build Setup') {
      parallel {
        stage('Build') {
          agent { label 'ecs-builder' }
          steps {
            initBuild()

            sh 'yarn install'
            sh 'yarn lint'
            sh 'yarn test:ci'

            securityScan()

            script {
              if (env.BRANCH_NAME == 'master') {
                publishNpmPackage('.')
              }
            }
          }
        }
      }
    }
  }
}
