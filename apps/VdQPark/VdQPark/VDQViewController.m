//
//  VDQViewController.m
//  VdQPark
//
//  Created by Guillaume Campagna on 2014-03-28.
//  Copyright (c) 2014 Transit. All rights reserved.
//

#import "VDQViewController.h"

@interface VDQViewController ()

@property (weak, nonatomic) IBOutlet UIWebView *webView;

@end

@implementation VDQViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSURL *URL = [NSURL URLWithString:@"http://localhost:3000"];
    NSURLRequest *request = [NSURLRequest requestWithURL:URL];
    
    [self.webView loadRequest:request];
}

@end
