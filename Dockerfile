FROM quay.io/voxmd/voxmd:latest
RUN git clone https://github.com/Vox-Net/VOX-MD.git /root/Vox-Net/
WORKDIR /root/Vox-Net/
RUN npm install
CMD ["npm", "start"]
