package ma.planification.planification.client;

import ma.planification.planification.dto.ProfileDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class ProfileClient {

    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://profile_service:3000/api/profiles}")
    private String profilesBaseUrl;

    public ProfileClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ProfileDto getProfileById(Integer id) {
        try {
            String url = profilesBaseUrl + "/" + id;
            return restTemplate.getForObject(url, ProfileDto.class);
        } catch (RestClientException e) {
            return null;
        }
    }
}
