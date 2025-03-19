
import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col space-y-4 col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-foreground">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-solar-400 to-eco-400 flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">SolarCommunity</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Empowering communities to harness solar energy together, making renewable energy accessible and affordable for everyone.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Main Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/registration" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Registration
                </Link>
              </li>
              <li>
                <Link to="/data-collection" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Data Collection
                </Link>
              </li>
              <li>
                <Link to="/provider-matching" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Provider Matching
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/payment" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Payment & Cost-Sharing
                </Link>
              </li>
              <li>
                <Link to="/monitoring" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Energy Monitoring
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Community Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Maintenance Services
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SolarCommunity. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Made with ❤️ for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
};
