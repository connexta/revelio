IMAGE := benandryan1/revelio2:v1
image: 
	docker build -t $(IMAGE) .

push-image:
	docker push $(IMAGE)
