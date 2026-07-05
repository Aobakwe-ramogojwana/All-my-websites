import React from 'react'
import { Server, Shield, Wifi, Zap, Globe, Users, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const Services = () => {
  const services = [
    {
      icon: <Server className="h-8 w-8" />,
      title: 'Network Infrastructure',
      description: 'Design, implementation, and maintenance of robust network infrastructures tailored to your business needs.',
      features: ['Network design', 'Hardware procurement', 'Installation & configuration', 'Performance monitoring'],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Cybersecurity Solutions',
      description: 'Comprehensive security measures to protect your digital assets from cyber threats.',
      features: ['Firewall setup', 'VPN solutions', 'Security audits', 'Threat detection'],
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: 'Wireless Networking',
      description: 'Reliable Wi-Fi solutions ensuring seamless connectivity across your entire business environment.',
      features: ['Wireless design', 'Access point deployment', 'Guest networks', 'Network optimization'],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'IT Support Services',
      description: '24/7 IT support to keep your systems running smoothly and minimize downtime.',
      features: ['Helpdesk support', 'Remote assistance', 'Preventive maintenance', 'Software updates'],
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Cloud Integration',
      description: 'Seamless integration of cloud services for enhanced collaboration and scalability.',
      features: ['Cloud migration', 'Virtualization', 'Data backup', 'Cloud security'],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Consulting Services',
      description: 'Expert IT consulting to help you make informed decisions about your technology investments.',
      features: ['IT strategy', 'Technology assessment', 'Cost optimization', 'Digital transformation'],
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive IT solutions designed to meet the evolving needs of modern businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
