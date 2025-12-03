package ma.planification.planification.client;

import ma.planification.planification.dto.ProfileDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class ProfileClient {

    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://profile_service:3000/api/profiles}")
    private String profilesBaseUrl;

    public ProfileClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Autowired
    private HttpServletRequest request;

    public ProfileDto getProfileById(String id) {
        try {
            System.out.println("--------------------before fetch: ------------------------");
            String url = profilesBaseUrl + "/" + id;
            HttpHeaders headers = new HttpHeaders();
            String auth = request.getHeader("Authorization");
            if (auth != null && !auth.isBlank()) {
                headers.set("Authorization", auth);
            }
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            return restTemplate.exchange(url, HttpMethod.GET, entity, ProfileDto.class).getBody();
        } catch (RestClientException e) {
            System.out.println("❌ ERREUR lors de l'appel à ProfileClient file profileclient :");
            e.printStackTrace();
            return null;
        }
    }
}
