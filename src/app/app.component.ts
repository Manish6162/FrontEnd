import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  generatedUsername: string = '';
  profilePicUrl: string = '';

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.checkAndSetUserInfo();
  }

  async checkAndSetUserInfo(): Promise<void> {
    try {
      const metadata = await this.collectUserMetadata();
      this.userService.checkAndGenerateUser(metadata).subscribe(
        (response: any) => {
          const { username, profilePicUrl } = response;
          if (username && profilePicUrl) {
            this.generatedUsername = username;
            this.profilePicUrl = profilePicUrl;
            console.log('Username:', username);
          } else {
            console.error('Invalid API response:', response);
          }
        },
        (error: any) => {
          console.error('Error checking/generating user:', error);
        }
      );
    } catch (error) {
      console.error('Error collecting user metadata:', error);
    }
  }

  async collectUserMetadata(): Promise<{ ip: string; userAgent: string; location: string; browserInfo: string }> {
    try {
      const ipResponse = await this.http.get<{ ip: string }>('https://api.ipify.org?format=json').toPromise();
      const userAgent = navigator.userAgent;
      const browserInfo = this.getBrowserInfo();

      let location = 'unknown';
      if (ipResponse && ipResponse.ip) {
        try {
          const locationResponse = await this.http.get<{ city: string, region: string, country: string }>(
            `https://ipapi.co/${ipResponse.ip}/json/`
          ).toPromise();

          if (locationResponse) {
            location = `${locationResponse.city}, ${locationResponse.region}, ${locationResponse.country}`;
          }
        } catch (locationError) {
          console.error('Error fetching location from IP:', locationError);
        }
      }

      return {
        ip: ipResponse ? ipResponse.ip : 'unknown',
        userAgent: userAgent,
        location: location,
        browserInfo: browserInfo
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  getBrowserInfo(): string {
    const { appName, appVersion, platform } = navigator;
    return `AppName: ${appName}, AppVersion: ${appVersion}, Platform: ${platform}`;
  }
}
