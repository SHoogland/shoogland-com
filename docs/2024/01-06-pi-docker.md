    1  apt update
    2  sudo apt update
    3  sudo apt upgrade
//    4  reboot
    5  sudo reboot
    6  hostnamectl
    7  DISTRO=$(lsb_release -c | awk '{print $2}')
    8  echo $DISTRO
    9  curl -fsSL https://swupdate.openvpn.net/repos/openvpn-repo-pkg-key.pub | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/openvpn-repo-pkg-keyring.gpg
   10  gpg
   11  gpg --dearmor
   12  sudo curl -fsSL https://swupdate.openvpn.net/community/openvpn3/repos/openvpn3-$DISTRO.list -o /etc/apt/sources.list.d/openvpn3.list
   13  sudo apt update
   14  sudo apt install openvpn
//   15  curl -O https://network-management-gw.openvpn.com/network-gate/api/v1/scripts/RGViaWFuIDEx/host/debian_11.sh
//   16  chmod +x debian_11.sh
//   17  ./debian_11.sh
   18  sudo apt-get update
   19  sudo apt-get install ca-certificates curl gnupg
   20  sudo install -m 0755 -d /etc/apt/keyrings
   21  curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   22  sudo chmod a+r /etc/apt/keyrings/docker.gpg
   23  echo   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/raspbian \
   24    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   25  sudo apt-get update
   26  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   27  sudo docker run hello-world
   28  echo $(lsb_release -cs) 
   29  $(dpkg --print-architecture)
   30  dpkg --print-architecture
   31  # Add Docker's official GPG key:
   32  sudo apt-get update
   33  sudo apt-get install ca-certificates curl gnupg
   34  sudo install -m 0755 -d /etc/apt/keyrings
   35  curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   36  sudo chmod a+r /etc/apt/keyrings/docker.gpg
   37  # Set up Docker's Apt repository:
   38  echo   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/raspbian \
   39    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   40  sudo apt-get update
   41  history
   42  cat /etc/apt/sources.list.d/openvpn3.list 
   43  rm /etc/apt/sources.list.d/openvpn3.list 
   44  sudo rm /etc/apt/sources.list.d/openvpn3.list 
   45  sudo apt-get update
   46  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   47  sudo nano /etc/apt/sources.list.d/docker.list
   48  sudo apt-get update
   49  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   50  apt-cache madison docker-ce | awk '{ print $3 }'
   51  apt-cache madison docker-ce
   52  sudo nano /etc/apt/sources.list.d/docker.list
   53  sudo apt-get update
   54  sudo nano /etc/apt/sources.list.d/docker.list
   55  sudo apt-get update
   56  apt-cache madison docker-ce
   57  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   58  docker 
   59  sudo groupadd docker
   60  sudo usermod -aG docker $USER
   61  exit
   62  ls
   63  exit
   64  docker run hello-world
   65  docker ps
   66  docker prune
   67  docker image prune
   68  docker ps -al
   69  docker rm hello-world
   70  docker
   71  docker rm
   72  docker rm hello-world
   73  docker ps -al
   74  docker rm 3f06e7218807
   75  docker image prune
   76  docker ps -al
   77  docker image list
   78  docker image rm hello-world
   79  docker ps
   80  df
   81  df 0h
   82  df -h
   83  docker compose
   84  docker compose up -d
   85  docker compose logs
   86  exit
   87  raspi-config
   88  sudo raspi-config
   89  raspistill
   90  sudo nano home-assistant-config/configuration.yaml 
   91  docker compose logs
   92  sudo shutdown -h now
   93  shutdown -h now
   94  sudo shutdown -h now
   95  docker ps
   96  history
