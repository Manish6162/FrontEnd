import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  orderedFeeds: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveFileUrls();
  }

  retrieveFileUrls(): void {
    const apiUrl = 'https://todeploywebapi.azurewebsites.net/api/Feeds/all'; // Updated API endpoint

    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.orderedFeeds = response.orderedFeeds;
      },
      (error) => {
        console.error('An error occurred while retrieving feeds:', error);
      }
    );
  }

  downloadFile(url: string): void {
    // Implement your download logic here
    // For simplicity, you can open the file in a new tab
    window.open(url, '_blank');
  }

  reportFeed(feedId: string): void {
    // Implement your report logic here
    console.log(`Report feed: ${feedId}`);
  }

  likeFeed(feedId: string, index: number): void {
    const likeApiUrl = `https://todeploywebapi.azurewebsites.net/api/Feeds/${feedId}/like`;

    this.http.put(likeApiUrl, {}).subscribe(
      (response: any) => {
        console.log('Feed liked successfully');
        // Update the likes count in the UI or perform any other action
        this.orderedFeeds[index].liked = !this.orderedFeeds[index].liked; // Toggle liked state
        if (this.orderedFeeds[index].liked) {
          this.orderedFeeds[index].likes++;
        } else {
          this.orderedFeeds[index].likes--;
        }
      },
      (error) => {
        console.error('An error occurred while liking the feed:', error);
        // Handle error
      }
    );
  }
}
