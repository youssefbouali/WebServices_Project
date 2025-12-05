"""
Locust load testing file for Device API
Run with: locust -f locustfile.py --host=http://localhost:8000
"""
from locust import HttpUser, task, between
import random


class DeviceAPIUser(HttpUser):
    """
    Simulates a user interacting with the Device API.
    Tests CRUD operations under load.
    """
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """Called when a simulated user starts"""
        self.device_ids = []
        # Create some initial devices
        for i in range(3):
            response = self.client.post(
                "/devices/",
                json={
                    "name": f"LoadTest-Device-{random.randint(1000, 9999)}",
                    "type": random.choice(["sensor", "actuator", "gateway"])
                }
            )
            if response.status_code == 200:
                self.device_ids.append(response.json()["id"])
    
    @task(5)
    def list_devices(self):
        """List all devices - most common operation (weight: 5)"""
        self.client.get("/devices/")
    
    @task(3)
    def get_device(self):
        """Get a specific device by ID (weight: 3)"""
        if self.device_ids:
            device_id = random.choice(self.device_ids)
            self.client.get(f"/devices/{device_id}")
    
    @task(2)
    def create_device(self):
        """Create a new device (weight: 2)"""
        response = self.client.post(
            "/devices/",
            json={
                "name": f"Device-{random.randint(1000, 9999)}",
                "type": random.choice(["sensor", "actuator", "gateway"])
            }
        )
        if response.status_code == 200:
            self.device_ids.append(response.json()["id"])
    
    @task(2)
    def update_device(self):
        """Update a device (weight: 2)"""
        if self.device_ids:
            device_id = random.choice(self.device_ids)
            self.client.put(
                f"/devices/{device_id}",
                json={
                    "status": random.choice(["active", "inactive", "maintenance"]),
                    "last_value": random.uniform(0, 100)
                }
            )
    
    @task(1)
    def delete_device(self):
        """Delete a device (weight: 1)"""
        if self.device_ids and len(self.device_ids) > 2:
            device_id = self.device_ids.pop()
            self.client.delete(f"/devices/{device_id}")
    
    def on_stop(self):
        """Called when a simulated user stops - cleanup"""
        # Clean up created devices
        for device_id in self.device_ids:
            try:
                self.client.delete(f"/devices/{device_id}")
            except:
                pass  # Ignore errors during cleanup


class AdminUser(HttpUser):
    """
    Simulates an admin user performing bulk operations.
    """
    wait_time = between(2, 5)
    
    @task
    def list_all_devices(self):
        """Admin listing all devices with high limit"""
        self.client.get("/devices/?limit=1000")
    
    @task
    def health_check(self):
        """Check API health"""
        self.client.get("/")
