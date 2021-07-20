FROM python:3.7
WORKDIR /app
ENV FLASK_ENV production
ENV FLASK_APP app.py
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["flask", "run"]
