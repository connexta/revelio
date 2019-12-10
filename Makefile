IMAGE := meschachte/revelio:v1
image: 
	docker build -t $(IMAGE) .

push-image:
	docker push $(IMAGE)
