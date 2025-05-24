pipeline {
    agent any

    environment {
        DOCKER_REPO = 'zoroozz/blue-green'
        VERSION = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build Image') {
            steps {
                sh 'docker build -t $DOCKER_REPO:$VERSION .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        docker push $DOCKER_REPO:$VERSION
                    '''
                }
            }
        }

        stage('Deploy Green') {
            steps {
                script {
                    // Update green deployment YAML dynamically
                    sh """
            sed -e "s|image: zoroozz/blue-green:.*|image: zoroozz/blue-green:$VERSION|" \\
                -e "s|value: \\".* (Green)\\"|value: \\"$VERSION (Green)\\"|" \\
                k8s/deployment-green.yaml > temp-green.yaml
                    kubectl apply -f temp-green.yaml
                    kubectl apply -f k8s/service.yaml
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def ip = sh(script: " hostname -I | awk '{print \$1}'", returnStdout: true).trim()
                    def code = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://$ip", returnStdout: true).trim()
                    if (code != "200") {
                        error "Health check failed with HTTP code $code"
                    }
                }
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                sh 'kubectl patch service myapp-service -p \'{"spec": {"selector": {"version": "green"}}}\''
            }
        }

        stage('Cleanup Blue') {
            steps {
                sh 'kubectl delete deployment myapp-blue || true'
            }
        }
    }
}
