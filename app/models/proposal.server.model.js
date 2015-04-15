'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
 * Proposal Schema
 */
var ProposalSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Proposal name',
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please enter your address',
    trim: true
  },
  phone: {
    type: Number,
    default: '',
    required: 'Please enter your phone number',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please enter your address',
    trim: true
  },
  is501c3: {
    type: Boolean,
    default: false,
    required: 'Please denote 501c3 status'
  },
  ein: {
    type: Number,
    default: '',
    required: 'Please enter your EIN',
    trim: true
  },
  is_insured: {
    type: Boolean,
    default: false,
    required: 'Please denote insurance status'
  },
  insurance_info: {
    type: String,
    default: '',
    required: 'Please attach insurance information if you are insured.'
  },
  is_racist: {
    type: Boolean,
    default: true,
    required: 'Please acknowledge whether you are willing to adhere to our non-discrimination policy'
  },
  mission: {
    type: String,
    default: '',
    required: 'Please describe your mission and vision for the program.',
    trim: true
  },
  overview: {
    type: String,
    default: '',
    required: 'Please give us an overview of the program.',
    trim: true
  },
  population_served: {
    type: String,
    default: '',
    required: 'Please describe the population that you serve.',
    trim: true
  },
  assessment_description: {
    type: String,
    default: '',
    required: 'Please describe how you assess your program\'s success.',
    trim: true
  },
  proposal_description: {
    type: String,
    default: '',
    required: 'Please describe your project proposal in 500 words or less.',
    trim: true
  },
  requires_interaction_with_students_and_clients: {
    type: Boolean,
    default: true,
    required: 'Please acknowledge whether the project requires student-client interaction'
  },
  requires_bg_check: {
    type: Boolean,
    default: true,
    required: 'Please acknowledge whether the project requires a background check.'
  },
  agency_pays_for_bg_check: {
    type: Boolean,
    default: true,
    required: 'Please acknowledge whether the agency will be responsible for the cost of background checks.'
  },
  cost_of_bg_check: {
    type: Number,
    default: '',
    required: 'Please enter the cost of background check.'
  },
  agency_agrees_to_partnership: {
    type: Boolean,
    default: true,
    required: 'Please acknowledge whether the agency agrees to a formalized partnership with faculty.'
  },
  partnerships: {
    type: String,
    default: '',
    required: 'Please select the colleges or course areas that you are interested in partnering with.',
    enum: ['school1','school2','school3'],
    trim: true
  },
  previous_experience: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Proposal', ProposalSchema);
