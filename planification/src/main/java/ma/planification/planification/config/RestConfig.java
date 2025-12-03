package ma.planification.planification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class RestConfig {

	@Bean
	public RestTemplate restTemplate() {
		RestTemplate rt = new RestTemplate();
		rt.getInterceptors().add((request, body, execution) -> {
			ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
			if (attrs != null) {
				HttpServletRequest current = attrs.getRequest();
				String auth = current.getHeader("Authorization");
				if (auth != null && !auth.isBlank()) {
					request.getHeaders().add("Authorization", auth);
				}
			}
			return execution.execute(request, body);
		});
		return rt;
	}
}
